using NUnit.Framework;

namespace Checkers.UnitTests
{
    public class LocationTests
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        [TestCase("a1", 0, 0)]
        [TestCase("a5", 0, 4)]
        [TestCase("d3", 3, 2)]
        [TestCase("h8", 7, 7)]
        public void FromString_GetsCorrectValues(string s, int x, int y)
        {
            var location = Location.FromString(s);
            Assert.AreEqual(x, location.X);
            Assert.AreEqual(y, location.Y);
        }
    }
}