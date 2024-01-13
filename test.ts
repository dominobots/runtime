import domino from "./mod.ts";

const { app } = domino({});

app.get("/", (c) => c.text("hello"));
