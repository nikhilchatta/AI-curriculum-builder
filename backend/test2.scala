import java.sql._
import java.net._
import java.io._
import scala.collection.mutable
import scala.concurrent._
import ExecutionContext.Implicits.global

object TerribleApp {

  // Hardcoded secrets (security issue)
  val dbUser = "admin"
  val dbPass = "password123"
  val apiKey = "SECRET_API_KEY"

  // Mutable global state (race condition)
  var counter: Int = 0
  val cache = mutable.Map[String, String]()

  // Insecure DB connection (no SSL, no pooling)
  val conn = DriverManager.getConnection(
    "jdbc:mysql://localhost:3306/appdb?useSSL=false",
    dbUser,
    dbPass
  )

  def main(args: Array[String]): Unit = {
    // Null usage (NPE risk)
    val input: String = null
    println(input.length)

    // SQL injection
    val userInput = args(0)
    val stmt = conn.createStatement()
    val rs = stmt.executeQuery(
      "SELECT * FROM users WHERE name = '" + userInput + "'"
    )

    while (rs.next()) {
      println("User: " + rs.getString("name"))
    }

    // Command injection
    Runtime.getRuntime.exec("rm -rf " + userInput)

    // Infinite recursion (stack overflow)
    crash()

    // Blocking call inside async
    Future {
      Thread.sleep(10000)
      println("Finished blocking work")
    }

    // XSS vulnerability
    val html = "<html><body>" + userInput + "</body></html>"
    println(html)

    // Silent exception swallowing
    try {
      val x = 1 / 0
    } catch {
      case _: Throwable => {}
    }

    // Resource leak (never closed)
    val file = new FileInputStream("data.txt")
    file.read()

    // Race condition
    Future { counter += 1 }
    Future { counter += 1 }

    // Insecure HTTP (no TLS)
    val url = new URL("http://example.com/api?key=" + apiKey)
    val reader = new BufferedReader(new InputStreamReader(url.openStream()))
    println(reader.readLine())
  }

  def crash(): Unit = {
    crash()
  }
}
