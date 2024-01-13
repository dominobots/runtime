import { Hono } from "https://deno.land/x/hono/mod.ts";

export default function domino<S extends Object>(
  spec: S
): { bot: S; app: Hono } {
  const bot = new Proxy(spec, {
    get(target, prop, receiver) {
      return (message: any) => {
        setTimeout(() => {
          target[prop](message);
        }, 1000);
      };
    }
  });

  const app = new Hono();

  app.get("/bot.json", (c) => {
    const nodes: {
      name: string;
      comment: string;
      transitions: {
        target: string;
      }[];
    }[] = [];

    for (const k in spec) {
      const fun = spec[k] as Function;
      const node = {
        name: fun.name,
        comment: "TODO: Node comment",
        transitions: extract_transitions(fun)
      };
      nodes.push(node);
    }

    return c.json({
      comment: "TODO: Bot comment",
      nodes
    });
  });

  return { bot, app };
}

function extract_transitions(fun: Function) {
  const transitions: { comment: string; target: string }[] = [];

  const used = new Set<string>();
  fun.toString().replace(/bot\.(\w+)\(/g, (_, target) => {
    if (used.has(target)) return target;
    used.add(target);
    transitions.push({
      comment: "TODO: Transition comment",
      target
    });
    return target;
  });

  return transitions;
}
