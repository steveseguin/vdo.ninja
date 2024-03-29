import os
import json
from PIL import Image

def create_thumbnails(directory, thumbnail_size=(128, 128)):
    counter = 1
    data = []  # List to store image data

    for filename in os.listdir(directory):
        if filename.lower().endswith(('.png', '.webp')):
            try:
                with Image.open(os.path.join(directory, filename)) as img:
                    img.thumbnail(thumbnail_size)
                    # Convert RGBA to RGB if necessary
                    if img.mode == 'RGBA':
                        img = img.convert('RGB')
                    thumbnail_name = f"{filename.split('.')[0]}_thumb.jpg"
                    img.save(os.path.join(directory, thumbnail_name), "JPEG")

                    # Add original and thumbnail file names to data list
                    data.append({"original": filename, "thumbnail": thumbnail_name})
                    counter += 1
            except Exception as e:
                print(f"Error processing {filename}: {e}")

    # Save data to JSON file
    with open(os.path.join(directory, 'data.json'), 'w') as json_file:
        json.dump(data, json_file, indent=4)

if __name__ == "__main__":
    create_thumbnails('.')  # Current directory

