#!/usr/bin/env python3
"""Download images from GitHub issue #225"""
import subprocess
import json
import re
import urllib.request
import os

def main():
    print("🚀 Downloading images from geerlingguy/mini-rack issue #225...")

    # Use gh CLI to fetch issue with images
    try:
        result = subprocess.run(
            ['gh', 'issue', 'view', '225', '--repo', 'geerlingguy/mini-rack', '--json', 'body'],
            capture_output=True,
            text=True,
            check=True
        )
        issue_data = json.loads(result.stdout)
        body = issue_data.get('body', '')

        # Extract image URLs from markdown
        image_pattern = r'!\[.*?\]\((https://[^\)]+)\)'
        image_urls = re.findall(image_pattern, body)

        print(f"Found {len(image_urls)} images in the issue")

        # Download each image
        os.chdir('public')

        filenames = [
            'rack-hero.jpeg',
            'rack-front.jpeg',
            'rack-side.jpeg',
            'rack-internal.jpeg',
            'rack-cooling.jpeg',
            'rack-networking.jpeg',
            'rack-power.jpeg',
            'rack-assembly.jpeg'
        ]

        for idx, (url, filename) in enumerate(zip(image_urls, filenames)):
            print(f"📥 Downloading {filename}...")
            try:
                # Use gh to download with authentication
                subprocess.run(
                    ['curl', '-L', '-H', 'Authorization: Bearer $(gh auth token)', url, '-o', filename],
                    shell=False,
                    check=True
                )
                size = os.path.getsize(filename)
                print(f"   ✅ Downloaded {filename} ({size} bytes)")
            except Exception as e:
                print(f"   ❌ Failed: {e}")

        print("\n🎉 Download complete! Check the public/ directory")

    except subprocess.CalledProcessError as e:
        print(f"❌ Error running gh CLI: {e}")
        print(f"Output: {e.stdout}")
        print(f"Error: {e.stderr}")

if __name__ == '__main__':
    main()
