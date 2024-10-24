import { NestFactory } from "@nestjs/core";
import "@nestjs/platform-express";
import { AppModule } from "./app.module.ts";
import { initializeApp } from "firebase-admin/app";

const firebase_cert = Deno.env.get("FIREBASE_CERT");
if (!firebase_cert) {
    throw new Error("FIREBASE_CERT environment variable is required");
}
initializeApp(JSON.parse(firebase_cert));

const app = await NestFactory.create(AppModule);
app.listen(8080);
