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
        [TestCase("a1", 0, 7)]
        [TestCase("a5", 0, 3)]
        [TestCase("d3", 3, 5)]
        [TestCase("h8", 7, 0)]
        public void FromString_GetsCorrectValues(string s, int x, int y)
        {
            var location = Location.FromString(s);
            Assert.AreEqual(x, location.X);
            Assert.AreEqual(y, location.Y);
        }
    }
}