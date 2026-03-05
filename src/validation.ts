import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())
  .post(
    "/request",
    ({ body }) => {
      return {
        message: "Success",
        data: body,
      };
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3 }),
        email: t.String({ format: "email" }),
        age: t.Number({ minimum: 18 }),
      }),
    },
  )
  .listen(3000);

app.get(
  "/products/:id",
  ({ params, query }) => {
    return {
      success: true,
      message: "Server OK",
      body: {
        params,
        query,
      },
    };
  },
  {
    response: t.Object({
      success: t.Boolean(),
      message: t.String(),
      body: t.Object({
        params: t.Object({
          id: t.Number(),
        }),
        query: t.Object({
          sort: t.String(),
        }),
      }),
    }),

    query: t.Object({
      sort: t.String({ enum: ["asc", "desc"] }),
    }),

    params: t.Object({
      id: t.Number(),
    }),
  },
);

app.get(
  "/stats",
  () => {
    return {
      success: true,
      message: "Server OK",
      data: {
        total: 100,
        active: 50,
      },
    };
  },
  {
    response: t.Object({
      success: t.Boolean(),
      message: t.String(),
      data: t.Object({
        total: t.Number(),
        active: t.Number(),
      }),
    }),
  },
);

app.get(
  "/admin",
  () => {
    return {
      success: true,
      message: "Server OK",
      body: {
        stats: 99,
      },
    };
  },
  {
    beforeHandle: ({ headers, set }) => {
      if (!headers.authorization) {
        set.status = 401;
        return {
          success: false,
          message: "Unauthorized",
        };
      }
      set.status = 200;
    },
  },
);

app.onAfterHandle(({ response }) => {
  return {
    success: true,
    message: "Data tersedia",
    data: response,
  };
});

app.get("/product", () => {
  return {
    id: 1,
    name: "Laptop",
  };
});

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
