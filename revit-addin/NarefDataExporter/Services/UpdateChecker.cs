using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Text.RegularExpressions;

namespace NarefDataExporter.Services;

/// <summary>Compares the installed version against the latest GitHub release.</summary>
public static class UpdateChecker
{
    private const string LatestReleaseApi = "https://api.github.com/repos/NKXVI16/Narefv1/releases/latest";
    public const string ReleasesPage = "https://github.com/NKXVI16/Narefv1/releases/latest";

    public static Version CurrentVersion =>
        Assembly.GetExecutingAssembly().GetName().Version ?? new Version(0, 0, 0);

    /// <summary>
    /// Returns the latest released version, or null with an explanation when the
    /// check is not possible (offline, private repository, no releases yet).
    /// </summary>
    public static Version? GetLatestVersion(out string? error)
    {
        error = null;
        try
        {
#if !NET5_0_OR_GREATER
            // .NET Framework 4.8 does not enable TLS 1.2 by default on all machines.
            ServicePointManager.SecurityProtocol |= SecurityProtocolType.Tls12;
#endif
            using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(10) };
            // GitHub's API rejects requests without a User-Agent.
            client.DefaultRequestHeaders.UserAgent.ParseAdd("NarefDataExporter");
            client.DefaultRequestHeaders.Accept.ParseAdd("application/vnd.github+json");

            using HttpResponseMessage response = client.GetAsync(LatestReleaseApi).GetAwaiter().GetResult();
            if (!response.IsSuccessStatusCode)
            {
                error = $"GitHub answered {(int)response.StatusCode} {response.StatusCode}. " +
                        "The repository may be private or have no releases yet.";
                return null;
            }

            string json = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
            Match match = Regex.Match(json, "\"tag_name\"\\s*:\\s*\"v?([0-9]+(?:\\.[0-9]+)*)\"");
            if (!match.Success)
            {
                error = "Could not read a version number from the latest release.";
                return null;
            }

            string tag = match.Groups[1].Value;
            if (tag.IndexOf('.') < 0) tag += ".0";
            return Version.Parse(tag);
        }
        catch (Exception ex)
        {
            error = "Could not reach GitHub: " + ex.Message;
            return null;
        }
    }
}
