# Hardware Page Photo Expansion Checklist

## Current Photos ✅
- [x] `/6AC09EE6-EF0D-479D-AA61-5466965FD22F_1_105_c.jpeg` - Noctua Wall
- [x] `/5D6A82F0-A483-4F3E-B1EE-0C1EB9AEE22C_1_105_c.jpeg` - Complete System
- [x] `/D29F915A-294D-4B0D-904D-FA84D3CD4B50_1_105_c.jpeg` - Enterprise I/O

## Additional Photos to Download from GitHub Issue #225

Visit: https://github.com/geerlingguy/mini-rack/issues/225

### To Add:
- [ ] `rack-hero.jpeg` - Main hero shot of complete build
- [ ] `rack-internal.jpeg` - Internal architecture view
- [ ] `rack-networking.jpeg` - Network layer close-up
- [ ] `rack-power.jpeg` - Power distribution detail
- [ ] `rack-assembly.jpeg` - Rear/bottom assembly view

## Instructions:

1. **Download Photos**
   - Open the GitHub issue in your browser
   - Right-click each image → "Save Image As..."
   - Save to: `/Users/bradlay/sddcinfo/website/public/`
   - Use the filenames listed above

2. **Enable in Gallery**
   - Open `src/pages/hardware.astro`
   - Uncomment the corresponding image entries (lines ~83-117)
   - Each photo already has a compelling title and description ready!

3. **Deploy**
   ```bash
   npm run build && wrangler deploy
   ```

## Gallery Features Already Built:
✨ Full-screen lightbox with keyboard navigation
✨ Hover effects with gradient overlays
✨ Image zoom on hover
✨ "Click to enlarge" hints
✨ Previous/Next navigation
✨ ESC to close
✨ Compelling narrative descriptions
