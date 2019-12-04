using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.AspNet.Identity;
using Microsoft.TeamFoundation.WorkItemTracking.WebApi;
using Microsoft.TeamFoundation.WorkItemTracking.WebApi.Models;
using Microsoft.VisualStudio.Services.Client;
using Microsoft.VisualStudio.Services.WebApi;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using VCCReportingTool.Models;

namespace VCCReportingTool.Controllers
{
    public class HomeController : Controller
    {
        private VCCReportingToolEntities db = new VCCReportingToolEntities();
        
        public ActionResult GetProjects(string SelectedItems, string FilterText)
        {
            try
            {
                //Prompt user for credential
                VssConnection connection = new VssConnection(new Uri("https://dev.azure.com/msazure"), new VssClientCredentials());
                var name = connection.Settings.ClientCertificateManager.ClientCertificates[0].Subject.Remove(0,3);
                var FullName = name.Substring(0, name.Length - 18);
                Random random = new Random();
                //save Login user details in table-User
                int isExistUser = (from u in db.Users where u.FullName == FullName select u).Count();
                if (isExistUser == 0)
                {
                    User objuser = new Models.User();
                    objuser.FullName = name;
                    objuser.ColorId = random.Next(1, 20);
                    db.Users.Add(objuser);
                    db.SaveChanges();
                }
                //create http client and query for resutls
                WorkItemTrackingHttpClient witClient = connection.GetClient<WorkItemTrackingHttpClient>();
                Wiql query = new Wiql();
                if (FilterText != "")
                {
                    query = new Wiql() { Query = @"SELECT [Id], [Title], [State] FROM workitems Where [System.AreaPath] IN(" + SelectedItems + ") AND [System.Tags] CONTAINS '" + FilterText + "'" };
                }
                else if(FilterText == "")
                {
                    query = new Wiql() { Query = @"SELECT [Id], [Title], [State] FROM workitems Where [System.AreaPath] IN(" + SelectedItems + ")" };
                }
                WorkItemQueryResult queryResults = witClient.QueryByWiqlAsync(query).Result;
                //Get the Work item id & URL
                if (queryResults == null || queryResults.WorkItems.Count() == 0)
                {
                    return Json(new { success = true, responseText = "Query did not find any results" });
                }
                else
                {
                    IEnumerable<WorkItemReference> workItemRefs;
                    List<int> list = new List<int>();
                    foreach (var item in queryResults.WorkItems)
                    {
                        list.Add(item.Id);
                    }

                    int[] arr = list.ToArray();

                    //build a list of the fields we want to see
                    string[] fields = new string[5];
                    fields[0] = "System.Id";
                    fields[1] = "System.Title";
                    fields[2] = "System.State";
                    fields[3] = "System.AssignedTo";
                    fields[4] = "System.AreaPath";

                    workItemRefs = queryResults.WorkItems.Take(50);
                    var workitems = witClient.GetWorkItemsAsync(workItemRefs.Select(wir => wir.Id)).Result;
                    foreach (var workItem in workitems)
                    {
                        var projectname = workItem.Fields["System.AreaPath"].ToString().Replace("One\\Business Applications Group Websites\\", "");
                        if (projectname.Contains("Dynamics 365 Marketing Website")){projectname = "Dynamics";}
                        else if (projectname.Contains("Dynamics 365 Marketing Website\\Integrated Marketing")) { projectname = "Dynamics 365 Integrated Marketing"; }
                        else if (projectname.Contains("Power BI Marketing Website")){projectname = "Power BI";}
                        else if (projectname.Contains("Power BI Marketing Website\\Integrated Marketing")) { projectname = "Power BI Integrated Marketing"; }
                        else if (projectname.Contains("Power Platform Marketing Website")) { projectname = "Power Platform"; }
                        else if (projectname.Contains("Power Query Marketing Website")) { projectname = "Power Query"; }

                        var getresult = db.WorkItems.Where(x => x.DevopsItemID == workItem.Id).ToList();
                        int maxlength = 70;
                        if (getresult.Count == 0)
                        {
                            VCCReportingTool.Models.WorkItem objworkitem = new VCCReportingTool.Models.WorkItem();
                            objworkitem.DevopsItemID = workItem.Id;
                            objworkitem.Summary = workItem.Fields["System.Title"].ToString();
                            if(objworkitem.Summary.Length > maxlength)
                            {
                                objworkitem.Summary = objworkitem.Summary.Substring(0, Math.Min(objworkitem.Summary.Length, maxlength));
                                objworkitem.Summary = objworkitem.Summary + ".....";
                            }
                            objworkitem.ProjectName = projectname;
                            objworkitem.IsUpdated = false;
                            db.WorkItems.Add(objworkitem);
                            db.SaveChanges();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return Json(new { success = true, responseText = "Sync Data Completed Successfully" });
        }
    }
}