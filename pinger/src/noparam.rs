use actix_web::{web, App, HttpResponse, HttpServer};

fn main() {
    let server = HttpServer::new(|| {
        App::new()
            .route("/", web::get().to(get_response))
    });
    
    println!("The HTTP Pinger is listening to port 1619...");
    
    server
        .bind("0.0.0.0:1619").expect("Error: Unable to bind server to an address")
        .run().expect("Error: Unable to run the server");
}

fn get_response() -> HttpResponse {
    HttpResponse::Ok()
        .content_type("text/html")
        .body(
            r#"
            Hello!
            "#,
        )
}
