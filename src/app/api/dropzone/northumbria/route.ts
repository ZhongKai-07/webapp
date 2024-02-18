import { FeatureCollection } from 'geojson';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const fileData = await import('./dropzones.json');
    const dropZoneMockData: FeatureCollection = fileData as FeatureCollection;
    return NextResponse.json(dropZoneMockData);
  } catch (error) {
    return NextResponse.json({});
  }
}
