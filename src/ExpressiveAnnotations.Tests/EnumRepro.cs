using ExpressiveAnnotations.Analysis;
using ExpressiveAnnotations.Attributes;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ExpressiveAnnotations.Tests
{
    public enum IHaveA
    {
        Car,
        Truck,
    }

    public class Car
    {
        public int id { get; set; }
    }

    public class Truck
    {
        public int id { get; set; }
    }

    public class IHaveOne
    {
        public IHaveA IHaveA { get; set; }

        public int? CarId { get; set; }
        public Car Car { get; set; }

        public int? TruckId { get; set; }
        public Truck Truck { get; set; }
    }

    [TestClass]
    public class EnumRepro
    {
        [TestMethod]
        public void repro_enum_issue()
        {
            var model = new IHaveOne
            {
                IHaveA = IHaveA.Car,
                CarId  = 1,
                Car    = new Car { id = 1 }
            };

            var parser = new Parser();
            parser.RegisterMethods();

            Assert.IsTrue(parser.Parse(model.GetType(), "IHaveA == IHaveA.Car").Invoke(model));

            //IHaveA should be a member
            Assert.AreEqual(1, parser.GetMembers().Count);

            //IHaveA.Car should be part of an enum should be a member
            Assert.AreEqual(1, parser.GetEnums().Count);
        }
    }
}
