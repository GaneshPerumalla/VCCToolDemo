using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VCCReportingTool.Models
{
    public class WorkItemUpdateClass
    {
        public int DevopsItemID { get; set; }
        public string Summary { get; set; }
        public int Priority { get; set; }
        public string pendingWith { get; set; }
        public string ExpectedReleaseDate { get; set; }
        public int Status { get; set; }
        public int Assignee { get; set; }
    }
}