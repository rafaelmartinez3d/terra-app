import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function saveImage(
  file: File,
): Promise<{ url: string; error?: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { url: "", error: "Only JPEG, PNG, and WebP images are allowed." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { url: "", error: "Image must be less than 5MB." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // For MVP, store files directly without Sharp processing
  // Sharp can be added for production optimization
  const ext = file.type.split("/")[1];
  const filename = `${uuidv4()}.${ext}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return { url: `/uploads/${filename}` };
}
