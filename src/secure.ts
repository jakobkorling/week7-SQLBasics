import { z } from 'zod';

const QuerySchema = z.object({
  category: z.enum(['Gifts', 'Lifestyle', 'Tech', 'Books'])
});

const validatedQuery = QuerySchema.parse(req.query);

const result = await pool.query(
  `SELECT name, description FROM products WHERE category = $1 AND released = 1`,
  [validatedQuery.category]
);