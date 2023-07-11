// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import GDPRWebhookHandlers from "./gdpr.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

//******** Shopify app Routes ********/
app.get('/api/products', async (req, res) => {
  try{
    const session = res.locals.shopify.session;
    const products = await shopify.api.rest.Product.all({session: session});
    res.status(200).send(products);
  } catch(err) {
    console.log("Error fetching products | server: ", err);
  }
});

app.post('/api/products/update', async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    const { id, title, description, variants } = req.body;
    const product = await new shopify.api.rest.Product({session: session});
    product.id = id;
    product.title = title;
    product.body_html = description;
    product.variants = variants;
    await product.save({
      update: true,
    });
    res.status(200).send(product);
  } catch(err) {
    console.log("Error updating product | server: ", err);
  }
});
//********* Shopify app Routes end *******/

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);