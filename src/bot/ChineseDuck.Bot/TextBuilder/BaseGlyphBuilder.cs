using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using SixLabors.Fonts;
using SixLabors.Primitives;
using SixLabors.Shapes;

namespace ChineseDuck.Bot.TextBuilder
{
    /// <summary>
    /// rendering surface that Fonts can use to generate Shapes.
    /// </summary>
    internal class BaseGlyphBuilder : IGlyphRenderer
    {
        protected readonly PathBuilder Builder;
        private readonly List<RectangleF> _glyphBounds = new List<RectangleF>();
        private readonly List<IPath> _paths = new List<IPath>();
        private Vector2 _currentPoint = default(Vector2);

        /// <summary>
        /// Initializes a new instance of the <see cref="GlyphBuilder"/> class.
        /// </summary>
        public BaseGlyphBuilder()
        {
            // glyphs are rendered relative to bottom left so invert the Y axis to allow it to render on top left origin surface
            Builder = new PathBuilder();
        }

        /// <summary>
        /// Gets the paths that have been rendered by this.
        /// </summary>
        public IPathCollection Paths => new PathCollection(_paths);

        /// <summary>
        /// Gets the paths that have been rendered by this.
        /// </summary>
        public IPathCollection Boxes => new PathCollection(_glyphBounds.Select(x => new RectangularPolygon(x)));

        /// <summary>
        /// Gets the paths that have been rendered by this.
        /// </summary>
        public IPath TextBox { get; private set; }

        void IGlyphRenderer.EndText()
        {
        }

        void IGlyphRenderer.BeginText(RectangleF rect)
        {
            TextBox = new RectangularPolygon(rect);
            BeginText(rect);
        }

        protected virtual void BeginText(RectangleF rect)
        {
        }

        bool IGlyphRenderer.BeginGlyph(RectangleF rect, GlyphRendererParameters cacheKey)
        {
            Builder.Clear();
            _glyphBounds.Add(rect);
            return BeginGlyph(rect, cacheKey);
        }

        protected virtual bool BeginGlyph(RectangleF rect, GlyphRendererParameters cacheKey)
        {
            BeginGlyph(rect);
            return true;
        }

        protected virtual void BeginGlyph(RectangleF rect)
        {
        }

        /// <summary>
        /// Begins the figure.
        /// </summary>
        void IGlyphRenderer.BeginFigure()
        {
            Builder.StartFigure();
        }

        /// <summary>
        /// Draws a cubic bezier from the current point  to the <paramref name="point"/>
        /// </summary>
        /// <param name="secondControlPoint">The second control point.</param>
        /// <param name="thirdControlPoint">The third control point.</param>
        /// <param name="point">The point.</param>
        void IGlyphRenderer.CubicBezierTo(PointF secondControlPoint, PointF thirdControlPoint, PointF point)
        {
            Builder.AddBezier(_currentPoint, secondControlPoint, thirdControlPoint, point);
            _currentPoint = point;
        }

        /// <summary>
        /// Ends the glyph.
        /// </summary>
        void IGlyphRenderer.EndGlyph()
        {
            _paths.Add(Builder.Build());
        }

        /// <summary>
        /// Ends the figure.
        /// </summary>
        void IGlyphRenderer.EndFigure()
        {
            Builder.CloseFigure();
        }

        /// <summary>
        /// Draws a line from the current point  to the <paramref name="point"/>.
        /// </summary>
        /// <param name="point">The point.</param>
        void IGlyphRenderer.LineTo(PointF point)
        {
            Builder.AddLine(_currentPoint, point);
            _currentPoint = point;
        }

        /// <summary>
        /// Moves to current point to the supplied vector.
        /// </summary>
        /// <param name="point">The point.</param>
        void IGlyphRenderer.MoveTo(PointF point)
        {
            Builder.StartFigure();
            _currentPoint = point;
        }

        /// <summary>
        /// Draws a quadratics bezier from the current point  to the <paramref name="endPoint"/>
        /// </summary>
        /// <param name="secondControlPoint">The second control point.</param>
        /// <param name="endPoint">The point.</param>
        void IGlyphRenderer.QuadraticBezierTo(PointF secondControlPoint, PointF endPoint)
        {
            Vector2 startPointVector = _currentPoint;
            Vector2 controlPointVector = secondControlPoint;
            Vector2 endPointVector = endPoint;

            Vector2 c1 = (((controlPointVector - startPointVector) * 2) / 3) + startPointVector;
            Vector2 c2 = (((controlPointVector - endPointVector) * 2) / 3) + endPointVector;

            Builder.AddBezier(startPointVector, c1, c2, endPoint);
            _currentPoint = endPoint;
        }
    }
}
