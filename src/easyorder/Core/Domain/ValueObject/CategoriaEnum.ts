/**
 * @swagger
 * components:
 *   schemas:
 *     CategoriaEnum:
 *       type: string
 *       enum:
 *         - LANCHE
 *         - BEBIDA
 *         - SOBREMESA
 *         - ACOMPANHAMENTO
 */
export enum CategoriaEnum {
    LANCHE = 'LANCHE',
    BEBIDA = 'BEBIDA',
    SOBREMESA = 'SOBREMESA',
    ACOMPANHAMENTO = 'ACOMPANHAMENTO'
}