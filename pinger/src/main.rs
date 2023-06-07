use actix_web::{get, web, Result};
use serde::Deserialize;
use std::path::Path;


#[derive(Deserialize)]
struct Info {
    provider_id: String,
    client_id: String,
}

#[get("/updateping/{provider_id}/{client_id}")]
async fn index(info: web::Path<Info>) -> Result<String> {
    
    println!("Will be checking for path...");

    let homedir = dirs::home_dir().expect("Unable to read home directory").to_str().unwrap();

    let p = format!("{}/pings/{}/{}", homedir, info.provider_id, info.client_id);

    let exists = Path::new(&p).exists();
        
    Ok(format!(
        "Provider ID: {}, Client ID: {}, Exists: {}",
        info.provider_id, info.client_id, exists
    ))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    use actix_web::{App, HttpServer};

    HttpServer::new(|| App::new().service(index))
        .bind(("0.0.0.0", 8080))?
        .run()
        .await
}
