using NUnit.Framework;
using System.Collections.Generic;

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

        [Test]
        [TestCaseSource("AllLocations")]
        public void ToStringFromString_GetsOriginalValue(int x, int y)
        {
            var location = new Location(x, y);
            var roundTripLocation = Location.FromString(location.ToString());

            Assert.AreEqual(location, roundTripLocation);
        }

        static IEnumerable<object[]> AllLocations()
        {
            for (var x = 0; x < 8; x++)
            {
                for (var y = 0; y < 8; y++)
                {
                    yield return new object[] { x, y };
                }
            }
        }
    }
}