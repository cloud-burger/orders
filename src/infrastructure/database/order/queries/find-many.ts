import { OrderPaginationParams } from '~/domain/repositories/order';

export const FIND_MANY = (input: OrderPaginationParams) => {
  let clauses = '';

  if (input.status) {
    clauses = clauses.concat(' AND o.status = :status');
  }

  return `SELECT 
            o.*,
            json_agg(json_build_object(
                'id', p.id,
                'name', p.name,
                'category', p.category,
                'description', p.description,
                'amount', p.amount,
                'created_at', p.created_at,
                'updated_at', p.updated_at,
                'quantity', op.quantity,
                'notes', op.notes
            )) AS products
          FROM public.orders o
          JOIN public.orders_products op ON o.id = op.order_id
          JOIN public.products p ON op.product_id = p.id
          WHERE o.status <> 'FINISHED' ${clauses}
          GROUP BY o.id
          ORDER BY 
              CASE 
                  WHEN o.status = 'DONE' THEN 1
                  WHEN o.status = 'PREPARING' THEN 2
                  WHEN o.status = 'RECEIVED' THEN 3
                  ELSE 4
              END,
              o.created_at ASC
          LIMIT :size::numeric
          OFFSET (:page::numeric) * (:size::numeric - 1);`;
};
