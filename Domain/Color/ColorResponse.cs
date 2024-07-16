using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Color
{

    public class RGB
    {
        public int r { get; set; }
        public int g { get; set; }
        public int b { get; set; }
    }

    public class HSL
    {
        public int h { get; set; }
        public double s { get; set; }
        public double l { get; set; }
    }

    public class LAB
    {
        public double l { get; set; }
        public double a { get; set; }
        public double b { get; set; }
    }

    public class SwatchImg
    {
        public string svgNamed { get; set; }
        public string svg { get; set; }
    }

    public class ColorInfo
    {
        public string name { get; set; }
        public string hex { get; set; }
        public RGB rgb { get; set; }
        public HSL hsl { get; set; }
        public LAB lab { get; set; }
        public double luminance { get; set; }
        public double luminanceWCAG { get; set; }
        public string bestContrast { get; set; }
        public SwatchImg swatchImg { get; set; }
        public string requestedHex { get; set; }
        public double distance { get; set; }
    }

    public class ColorResponse
    {
        public string paletteTitle { get; set; }
        public List<ColorInfo> colors { get; set; }
    }
}
