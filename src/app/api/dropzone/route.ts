import fs from 'fs/promises';
import { Feature, FeatureCollection } from 'geojson';
import { NextResponse } from 'next/server';
import path from 'path';

const data: Record<string, FeatureCollection | Feature> = {};
const directoryPath = 'src/app/api/dropzone';

export async function GET() {
  // Scan the directory for all json files and then load them and put them in an object based on their filename without extension
  const filesInDir = await fs.readdir(directoryPath);
  await Promise.all(filesInDir.map(scanDirectory));
  return NextResponse.json(data);
}
async function scanDirectory(
  file: string
): Promise<Record<string, FeatureCollection | Feature>> {
  const filePath = path.join(directoryPath, file);
  const fileStats = await fs.stat(filePath);

  if (fileStats.isFile() && path.extname(file) === '.json') {
    const fileName = path.basename(file, '.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(fileData);

    data[fileName] = jsonData;
  }

  return data;
}
