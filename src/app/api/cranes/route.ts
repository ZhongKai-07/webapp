import { FeatureCollection, Point } from 'geojson';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const fileData = await import('./data.json');
    const dropZoneMockData: FeatureCollection<Point> =
      fileData as FeatureCollection<Point>;
    return NextResponse.json(dropZoneMockData);
  } catch (error) {
    return NextResponse.json({});
  }
}
