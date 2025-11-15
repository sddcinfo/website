#!/bin/bash
# Download images from GitHub issue #225
# These images require browser authentication, so you'll need to:
# 1. Open https://github.com/geerlingguy/mini-rack/issues/225 in your browser
# 2. Open Developer Tools (F12)
# 3. Go to Network tab
# 4. Click on an image to view it full size
# 5. In Network tab, find the image request
# 6. Right-click → Copy → Copy as cURL
# 7. Paste below and modify to save with proper filename

# Example (you'll need to get the actual authenticated URLs from your browser):
cd "$(dirname "$0")/public"

echo "📸 Manual download required:"
echo "1. Visit: https://github.com/geerlingguy/mini-rack/issues/225"
echo "2. Right-click each image → 'Save Image As...'"
echo "3. Save to: $(pwd)"
echo ""
echo "Suggested filenames:"
echo "  - rack-hero.jpeg (main hero shot)"
echo "  - rack-front.jpeg (front panel view)"
echo "  - rack-side.jpeg (side detail)"
echo "  - rack-internal.jpeg (internal architecture)"
echo "  - rack-cooling.jpeg (cooling system detail)"
echo "  - rack-networking.jpeg (networking section)"
echo "  - rack-rear.jpeg (bottom/rear assembly)"
echo ""
echo "Then update src/pages/hardware.astro with the new image entries!"
