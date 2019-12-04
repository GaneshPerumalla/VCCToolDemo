using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace APICall
{
    class Program
    {
        public static void Main(string[] args)
        {
            GetProjectClass t = new GetProjectClass();
             t.GetProjects();
            Console.WriteLine("finished");
            Console.ReadKey();
        }
    }
}
