import os
import tempfile
import osmnx as ox  # For OpenStreetMap data
import geopandas as gpd  # For handling geospatial data
import pandas as pd  # For data manipulation
from shapely.geometry import MultiPolygon
from osmnx._errors import InsufficientResponseError
from shapely.geometry import shape
import shutil
from shapely.validation import make_valid  # To fix invalid geometries
from shapely.ops import unary_union  # For geometric operations
from shapely import to_geojson
import json
import random
from shapely.geometry import Point, Polygon, MultiPolygon
from shapely.geometry import shape
import geopandas as gpd
from shapely import to_geojson
import glob

# Initialize a global variable for bounding box (shape of the district/area you are loading)
bbox = None

dropzone_feature_type_property_name = "dropzone_feature_type"

path_prefix = "."



def prepare_bbox(district_shape):
    if (
        district_shape["type"] == "Feature"
        and district_shape["geometry"]["type"] == "Polygon"
    ):
        coordinates = district_shape["geometry"]["coordinates"]
        if isinstance(coordinates[0][0], list):
            # Flatten the coordinates if they are nested
            coordinates = [coord for sublist in coordinates for coord in sublist]
        district_shapely = Polygon(coordinates)
    elif (
        "geometry" in district_shape
        and district_shape["geometry"]["type"] == "MultiPolygon"
    ):
        district_shapely = MultiPolygon(
            [
                Polygon(poly[0], poly[1:])
                for poly in district_shape["geometry"]["coordinates"]
            ]
        )
    elif district_shape["type"] == "FeatureCollection":
        district_shapely = unary_union(
            [
                shape(feature["geometry"])
                if shape(feature["geometry"]).is_valid
                else make_valid(shape(feature["geometry"]))
                for feature in district_shape["features"]
            ]
        )
        if isinstance(district_shapely, Polygon):
            district_shapely = MultiPolygon([district_shapely])

    polygon = shape(district_shapely)

    # Validate and possibly fix the geometry
    if not polygon.is_valid:
        polygon = make_valid(polygon)

    # Bounds of the district shape
    global bbox
    bbox = polygon
    return polygon


# Function to extract OSM features within a bounding polygon
def extract_osm_features(gdf, feature_type, exclusion_tags=None):
    try:
        # Query OSM for the specified feature type within the bounding box
        if "=" in feature_type:
            feature_name, feature_value = feature_type.split("=")
            gdf_features = ox.features_from_polygon(
                bbox, tags={feature_name: feature_value}
            )
        else:
            gdf_features = ox.features_from_polygon(bbox, tags={feature_type: True})

        # Check if the returned data is a valid GeoDataFrame
        if (
            not isinstance(gdf_features, gpd.GeoDataFrame)
            or "geometry" not in gdf_features.columns
        ):
            print(
                f"'gdf_features' is not a GeoDataFrame or does not have a 'geometry' column."
            )
            return gpd.GeoDataFrame()

        # Filter out points from the GeoDataFrame
        gdf_features = gdf_features[gdf_features.geometry.type != "Point"]

        # Filter out features based on exclusion tags
        if exclusion_tags:
            for key, value in exclusion_tags.items():
                if key in gdf_features.columns:
                    gdf_features = gdf_features[
                        ~gdf_features[key].astype(str).eq(str(value))
                    ]

        # Add the feature type as a column
        gdf_features[dropzone_feature_type_property_name] = [feature_type] * len(
            gdf_features
        )
        print(f"Found {len(gdf_features)} {feature_type} features")
        return gdf_features

    except InsufficientResponseError:
        # Handle exception when no data is found for the feature type
        print(f"No data found for {feature_type} in the specified area.")
        return gpd.GeoDataFrame()


# Function to clean data types in GeoDataFrame
def clean_gdf(gdf):
    # Convert object types to strings in the GeoDataFrame
    for column in gdf.columns:
        if gdf[column].dtype == "object":
            gdf[column] = gdf[column].apply(
                lambda x: str(x) if isinstance(x, list) else x
            )
    return gdf


# Main function to process OSM data for a given district
def compute_osm():
    # Read the GeoJSON file into a GeoDataFrame
    gdf = gpd.GeoDataFrame(geometry=[bbox])

    # Concatenate features from various OSM categories
    all_features = gpd.GeoDataFrame(
        pd.concat(
            [
                # Extracting different types of features from OSM
                extract_osm_features(
                    gdf,
                    "highway",
                    exclusion_tags={"tunnel": "yes", "area:highway": "pedestrian"},
                ),
                extract_osm_features(gdf, "landuse=forest"),
                extract_osm_features(gdf, "natural=wood"),
                extract_osm_features(gdf, "historic=*"),
                extract_osm_features(gdf, "natural=hill"),
                extract_osm_features(gdf, "natural=peak"),
                extract_osm_features(
                    gdf, "landuse=railway", exclusion_tags={"tunnel": "yes"}
                ),
                extract_osm_features(gdf, "railway", exclusion_tags={"tunnel": "yes"}),
                extract_osm_features(gdf, "boundary=forest_compartment"),
                extract_osm_features(gdf, "boundary=forest"),
                extract_osm_features(gdf, "aeroway"),
                extract_osm_features(gdf, "landuse=cemetery"),
                extract_osm_features(gdf, "landuse=quarry"),
                extract_osm_features(gdf, "man_made=mast"),
                extract_osm_features(gdf, "natural=cliff"),
                extract_osm_features(gdf, "natural=water"),
                extract_osm_features(gdf, "power=plant"),
                extract_osm_features(gdf, "leisure=golf_course"),
                extract_osm_features(gdf, "leisure=park"),
                extract_osm_features(gdf, "leisure=stadium"),
                extract_osm_features(gdf, "leisure=nature_reserve"),
                extract_osm_features(gdf, "building=church"),
                extract_osm_features(gdf, "amenity=fountain"),
                extract_osm_features(gdf, "natural=scrub"),
                extract_osm_features(gdf, "waterway"),
                extract_osm_features(gdf, "designation=national_park"),
            ],
            ignore_index=True,
        )
    )
    print("Clean GDF")
    # Clean the concatenated GeoDataFrame
    all_features_cleaned = clean_gdf(all_features)

    # Clip the cleaned features to the bounding box (some roads lead outside the district)
    all_features_cleaned_clipped = gpd.clip(gdf=all_features_cleaned, mask=bbox)

    # Perform unary union operation on the clipped geometries
    # I removed this now to retain the feature types
    # gdf_conv = unary_union(all_features_cleaned_clipped["geometry"])

    # Modify the GeoDataFrame to contain only the clipped geometries and the dropzone_feature_type_property_name column
    geodataframe = all_features_cleaned_clipped[
        ["geometry", dropzone_feature_type_property_name]
    ]

    os.makedirs(f"{path_prefix}/{district}/excluded", exist_ok=True)

    with open(
        f"{path_prefix}/{district}/excluded/exclusions.json", "w"
    ) as output_file:
        output_file.write(geodataframe.to_json())
    return all_features_cleaned_clipped


def random_point_in_bounds(bounds):
    minx, miny, maxx, maxy = bounds
    return (random.uniform(minx, maxx), random.uniform(miny, maxy))


def create_square_around_point(point, size=5):
    x, y = point
    delta_deg = size / 111320  # Convert 5 meters to degrees
    square_coords = [
        [x - delta_deg, y - delta_deg],
        [x + delta_deg, y - delta_deg],
        [x + delta_deg, y + delta_deg],
        [x - delta_deg, y + delta_deg],
        [x - delta_deg, y - delta_deg],
    ]
    return square_coords


def is_square_within_polygon(square_coords, polygon):
    for coord in square_coords[:-1]:
        if not polygon.contains(Point(coord)):
            return False
    return True


def create_dropzones(district, district_shape, exclusionzones):
    # Convert district shape to a Shapely geometry

    district_shapely = prepare_bbox(district_shape)

    random_squares_set = []

    while len(random_squares_set) < max_squares:
        # Generate a random square within the bounds
        point = random_point_in_bounds(district_shapely.bounds)
        square_coords = create_square_around_point(point)
        square = Polygon(square_coords)

        # Check if the square is within the district and does not intersect with any exclusion zones
        if (
            district_shapely.contains(square)
            and not exclusionzones.intersects(square).any()
        ):
            random_squares_set.append(square)

        percent_progress = (len(random_squares_set) / max_squares) * 100
        if percent_progress % 5 == 0 and percent_progress // 5 != 0:
            print(round(percent_progress, 2), "%")

    random_squares_gdf = gpd.GeoDataFrame(geometry=random_squares_set)

    all_features_cleaned_clipped = gpd.clip(random_squares_gdf, district_shapely)

    os.makedirs(f"{path_prefix}/{district}", exist_ok=True)

    with open(f"{path_prefix}/{district}/dropzones.json", "w") as output_file:
        output_file.write(all_features_cleaned_clipped.to_json())


# Main execution
if __name__ == "__main__":
    # Load districts from all files with .json extension
    for district_file in glob.glob("*.json"):
        district = district_file.split(".")[0]

        # Generate folders for district and excluded
        district_folder = os.path.join(os.getcwd(), district)
        excluded_folder = os.path.join(district_folder, "excluded")

        os.makedirs(district_folder, exist_ok=True)
        os.makedirs(excluded_folder, exist_ok=True)

        with open(f"{district_file}", "r") as output_file:
            district_shape = prepare_bbox(json.load(output_file))

        max_squares = 750
        print(f"==================== {district} ====================")
        with open(district_file, "r") as file:
            district_shape = json.load(file)
        print(f"==================== Loading Exclusion Zones ====================")
        exclusionzones = compute_osm()
        print(f"==================== Calculating Drop Zones ====================")
        create_dropzones(district, district_shape, exclusionzones)
