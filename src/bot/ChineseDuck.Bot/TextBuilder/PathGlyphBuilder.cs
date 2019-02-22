﻿using System;
using System.Numerics;
using SixLabors.Primitives;
using SixLabors.Shapes;

namespace ChineseDuck.Bot.TextBuilder
{
    /// <summary>
    /// rendering surface that Fonts can use to generate Shapes by following a path
    /// </summary>
    internal class PathGlyphBuilder : GlyphBuilder
    {
        private readonly IPath _path;

        private float _offsetY;

        const float Pi = (float)Math.PI;
        const float HalfPi = Pi / 2f;

        /// <summary>
        /// Initializes a new instance of the <see cref="GlyphBuilder"/> class.
        /// </summary>
        /// <param name="path">The path to render the glyphs along.</param>
        public PathGlyphBuilder(IPath path)
        {
            _path = path;
        }

        protected override void BeginText(RectangleF rect)
        {
            _offsetY = rect.Height;
        }

        protected override void BeginGlyph(RectangleF rect)
        {
            var point = _path.PointAlongPath(rect.X);
            var targetPoint = point.Point + new PointF(0, rect.Y - _offsetY);

            // due to how matrix combining works you have to combine thins in the revers order of operation
            // this one rotates the glyph then moves it.
            var matrix = Matrix3x2.CreateTranslation(targetPoint - rect.Location) * Matrix3x2.CreateRotation(point.Angle - Pi, point.Point);
            Builder.SetTransform(matrix);
        }
    }
}
