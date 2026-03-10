using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

//The whole consept is for the users to be able to send a message n get feedback
app.MapGet("/", () => Results.Redirect("/index.html"));
app.MapGet("/contact", () => Results.Redirect("/contact.html"));

app.MapPost("/contact", async (HttpRequest request) =>
{
    var form = await request.ReadFormAsync();

    string name = form["name"].ToString();
    string email = form["email"].ToString();
    string message = form["message"].ToString();

    // If something is missing → show error page
    if (string.IsNullOrWhiteSpace(name) ||
        string.IsNullOrWhiteSpace(email) ||
        string.IsNullOrWhiteSpace(message))
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
}

.card{
  background:white;
  padding:40px;
  border-radius:16px;
  box-shadow:0 10px 30px rgba(0,0,0,0.08);
  max-width:600px;
  width:90%;
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
  <h1>Oj, något saknas</h1>
  <p>Alla fält måste fyllas i innan formuläret kan skickas.</p>
  <a href="/contact.html" class="btn">Tillbaka till kontaktformuläret</a>
</div>
</body>
</html>
""", "text/html");
    }

    // If everything is filled in → show confirmation page
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
  font-family: Arial, sans-serif;
  background:#f4fbff;
  display:flex;
  justify-content:center;
  align-items:center;
  min-height:100vh;
}

.card{
  background:white;
  padding:40px;
  border-radius:16px;
  box-shadow:0 10px 30px rgba(0,0,0,0.08);
  max-width:600px;
  width:90%;
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
    <p><strong>Namn:</strong> {{name}}</p>
    <p><strong>E-post:</strong> {{email}}</p>
    <p><strong>Meddelande:</strong> {{message}}</p>
  </div>

  <a href="/index.html" class="btn">Tillbaka till UniNet</a>
</div>
</body>
</html>
""", "text/html");
});

app.Run(); // http://localhost:5080/contact.html, COPY PASTE IT.

