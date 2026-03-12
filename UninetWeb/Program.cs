using System.Net;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Startsidan
app.MapGet("/", () => Results.Redirect("/index.html"));
app.MapGet("/contact", () => Results.Redirect("/contact.html"));

app.MapPost("/contact", async (HttpRequest request) =>
{
    var form = await request.ReadFormAsync();

    string name = form["name"].ToString().Trim();
    string email = form["email"].ToString().Trim();
    string message = form["message"].ToString().Trim();

    // Enkel server-side validation
    bool emailIsValid = !string.IsNullOrWhiteSpace(email) && email.Contains("@");

    if (string.IsNullOrWhiteSpace(name) ||
        string.IsNullOrWhiteSpace(email) ||
        string.IsNullOrWhiteSpace(message) ||
        !emailIsValid)
    {
        return Results.Content("""
<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Fel | UniNet</title>
  <style>
    body{
      margin:0;
      font-family:Arial, sans-serif;
      background:#f4fbff;
      display:flex;
      justify-content:center;
      align-items:center;
      min-height:100vh;
      padding:20px;
    }

    .card{
      background:white;
      padding:40px;
      border-radius:16px;
      box-shadow:0 10px 30px rgba(0,0,0,0.08);
      max-width:600px;
      width:100%;
      text-align:center;
    }

    h1{
      color:#d9534f;
      margin-bottom:10px;
    }

    p{
      color:#444;
      line-height:1.6;
    }

    .btn{
      display:inline-block;
      margin-top:25px;
      padding:12px 22px;
      background:#62BFED;
      color:white;
      text-decoration:none;
      border-radius:10px;
      font-weight:600;
    }

    .btn:hover{
      background:#006fa7;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Oj, något blev fel</h1>
    <p>Alla fält måste fyllas i och e-postadressen måste vara giltig.</p>
    <a href="/contact.html" class="btn">Tillbaka till kontaktformuläret</a>
  </div>
</body>
</html>
""", "text/html; charset=utf-8");
    }

    // HTML-enkodning för säkerhet
    string safeName = WebUtility.HtmlEncode(name);
    string safeEmail = WebUtility.HtmlEncode(email);
    string safeMessage = WebUtility.HtmlEncode(message);

    return Results.Content($$"""
<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tack | UniNet</title>
  <style>
    body{
      margin:0;
      font-family:Arial, sans-serif;
      background:#f4fbff;
      display:flex;
      justify-content:center;
      align-items:center;
      min-height:100vh;
      padding:20px;
    }

    .card{
      background:white;
      padding:40px;
      border-radius:16px;
      box-shadow:0 10px 30px rgba(0,0,0,0.08);
      max-width:600px;
      width:100%;
      text-align:center;
    }

    h1{
      color:#62BFED;
      margin-bottom:10px;
    }

    p{
      color:#444;
      line-height:1.6;
    }

    .info{
      margin-top:20px;
      text-align:left;
      background:#f7fbfd;
      padding:15px;
      border-radius:10px;
      word-break:break-word;
    }

    .btn{
      display:inline-block;
      margin-top:25px;
      padding:12px 22px;
      background:#62BFED;
      color:white;
      text-decoration:none;
      border-radius:10px;
      font-weight:600;
    }

    .btn:hover{
      background:#006fa7;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Tack för ditt meddelande!</h1>
    <p>Vi har tagit emot ditt meddelande och återkommer så snart som möjligt.</p>

    <div class="info">
      <p><strong>Namn:</strong> {{safeName}}</p>
      <p><strong>E-post:</strong> {{safeEmail}}</p>
      <p><strong>Meddelande:</strong> {{safeMessage}}</p>
    </div>

    <a href="/index.html" class="btn">Tillbaka till UniNet</a>
  </div>
</body>
</html>
""", "text/html; charset=utf-8");
});

app.Run();