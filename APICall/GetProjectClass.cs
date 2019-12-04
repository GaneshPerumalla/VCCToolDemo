using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace APICall
{
    public class GetProjectClass
    {
        public  void GetProjects()
        {
            try
            {
                var personalaccesstoken = "tjz6b7dxulbu2tc3ss6zhsxyra5amesmqgj36c3bqm72q43e7bsq";

                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Accept.Add(
                        new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic",
                        Convert.ToBase64String(
                            System.Text.ASCIIEncoding.ASCII.GetBytes(
                                string.Format("{0}:{1}", "", personalaccesstoken))));


                    using (HttpResponseMessage response = client.GetAsync(
                                "https://dev.azure.com/msazure/one/_apis/wit/workitems?ids=4873466,4951626,4871673&api-version=5.0").Result)
                    {
                        response.EnsureSuccessStatusCode();
                        string responseBody = response.Content.ReadAsStringAsync().Result;
                        Console.WriteLine(responseBody);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                Console.Read();
            }
            finally
            {
                Console.Read();
            }
        }

    }
}
