import express from 'express';
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger-output.json";

// import { ProdutoRepositoryMock } from './easyorder/Infrastructure/Output/Repository/Mock/ProdutoRepositoryMock';
// import { ClienteRepositoryMock } from './easyorder/Infrastructure/Output/Repository/Mock/ClienteRepositoryMock';
// import { PedidoRepositoryMock } from './easyorder/Infrastructure/Output/Repository/Mock/PedidoRepositoryMock';
import { CategoriaRepositoryMock } from './easyorder/Infrastructure/Output/Repository/Mock/CategoriaRepositoryMock';

import { PedidoRepositoryMySQL } from './easyorder/Infrastructure/Output/Repository/PedidoRepositoryMySQL';
import { ClienteRepositoryMySQL } from './easyorder/Infrastructure/Output/Repository/ClienteRepositoryMySQL';

import { CadastrarProdutoEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Produto/CadastrarProdutoEndpoint';
import { RemoverProdutoEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Produto/RemoverProdutoEndpoint';
import { BuscarProdutoEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Produto/BuscarProdutoEndpoint';

import { CadastrarClienteEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Clientes/CadastrarClienteEndpoint';
import { AtualizarClienteEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Clientes/AtualizarClienteEndpoint';
import { ListarClientesEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Clientes/ListarClientesEndpoint';
import { BuscarClienteEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Clientes/BuscarClienteEndpoint';

import { CadastrarPedidoEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Pedido/CadastrarPedidoEndpoint';
import { CancelarPedidoEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Pedido/CancelarPedidoEndpoint';
import { ListarPedidosPorStatusEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Pedido/ListarPedidosPorStatusEndpoint';
import { FecharPedidoEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Pedido/FecharPedidoEndpoint';
import { IniciarPreparacaoPedidoEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Preparacao/Pedido/IniciarPreparacaoPedidoEndpoint';
import { FinalizarPreparacaoPedidoEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Preparacao/Pedido/FinalizarPreparacaoPedidoEndpoint';
import { EntregarPedidoEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Preparacao/Pedido/EntregarPedidoEndpoint';

import { ListaCategoriasEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Produto/ListarCategoriasEndpoint';
import { CheckoutPedidoEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Pedido/CheckoutPedidoEndpoint';
import { ProdutoRepositoryMySQL } from './easyorder/Infrastructure/Output/Repository/ProdutoRepositoryMySQL';
import { AtualizarProdutoEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Produto/AtualizarProdutoEndpoint';

import { AdicionarComboAoPedidoEndpoint, AdicionarComboAoPedidoEndpointParam } from './easyorder/Infrastructure/Input/Endpoint/Pedido/AdicionarComboAoPedidoEndpoint';
import { RemoverComboDoPedidoEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Pedido/RemoverComboDoPedidoEndpoint';
import { BuscaProximoPedidoParaPreparacaoEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Preparacao/Pedido/BuscaProximoPedidoParaPreparacaoEndpoint';
import { ListarProdutoEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Produto/ListarProdutoEndPoint';
import { BuscaPedidoPorIdEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Pedido/BuscaPedidoPorIdEndpoint';

const clienteRepository = new ClienteRepositoryMySQL(
  process.env.DATABASE_HOST || 'ERROR',
  Number(process.env.DATABASE_PORT || '0'),
  process.env.DATABASE_NAME || 'ERROR',
  process.env.DATABASE_USER || 'ERROR',
  process.env.DATABASE_PASS || 'ERROR'
);

const produtoRepository = new ProdutoRepositoryMySQL(
  process.env.DATABASE_HOST || 'ERROR',
  Number(process.env.DATABASE_PORT || '0'),
  process.env.DATABASE_NAME || 'ERROR',
  process.env.DATABASE_USER || 'ERROR',
  process.env.DATABASE_PASS || 'ERROR'
);


const pedidoRepository = new PedidoRepositoryMySQL(
  process.env.DATABASE_HOST || 'ERROR',
  Number(process.env.DATABASE_PORT || '0'),
  process.env.DATABASE_NAME || 'ERROR',
  process.env.DATABASE_USER || 'ERROR',
  process.env.DATABASE_PASS || 'ERROR'
);

// Instanciar o mock e o use case para categorias
const categoriaRepositoryMock = new CategoriaRepositoryMock();

const app = express();
const port = Number(process.env.SERVER_PORT || '3000');

app.use(express.json());

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.get('/health', (req, res) => {
  /** #swagger.tags = ['Health']
      #swagger.summary = 'Health check'
  */
  res.json({
    status: 'UP'
  });
});

app.get('/', (req, res) => {
  res.send(`Acesse a documentação do Swagger em <A HREF="http://localhost:${port}/doc/">http://localhost:${port}/doc/</A>`);
});

// Contexto de cliente
app.post('/cliente/cadastrar', new CadastrarClienteEndpoint(clienteRepository).handle);
app.put('/cliente/atualizar', new AtualizarClienteEndpoint(clienteRepository).handle);
app.get('/cliente/listar', new ListarClientesEndpoint(clienteRepository).handle);
app.get('/cliente/buscar/:cpf', new BuscarClienteEndpoint(clienteRepository).handle);

// Contexto de produto
app.delete('/produto/remover/:id', new RemoverProdutoEndpoint(produtoRepository).handle);
app.get('/produto/categoria/listar', new ListaCategoriasEndpoint(categoriaRepositoryMock).handle);
app.get('/produto/buscar/:id', new BuscarProdutoEndpoint(produtoRepository).handle);
app.post('/produto/cadastrar', new CadastrarProdutoEndpoint(produtoRepository).handle);
app.put('/produto/atualizar', new AtualizarProdutoEndpoint(produtoRepository).handle);
app.get('/produto/listar', new ListarProdutoEndpoint(produtoRepository).handle);

// Contexto de pedido
app.post('/pedido', new CadastrarPedidoEndpoint(pedidoRepository).handle);
app.get('/pedido/listar/:statusPedido', new ListarPedidosPorStatusEndpoint(pedidoRepository).handle);
app.get('/pedido/:pedidoId', new BuscaPedidoPorIdEndpoint(pedidoRepository).handle);
app.put('/pedido/:pedidoId/cancelar', new CancelarPedidoEndpoint(pedidoRepository).handle);
app.put('/pedido/:pedidoId/checkout', new CheckoutPedidoEndpoint(pedidoRepository).handle);
app.put('/pedido/:pedidoId/fechar', new FecharPedidoEndpoint(pedidoRepository).handle);
const adicionarComboAoPedidoEndpointParam = new AdicionarComboAoPedidoEndpointParam(pedidoRepository, produtoRepository);
app.post('/pedido/:pedidoId/combo', new AdicionarComboAoPedidoEndpoint(adicionarComboAoPedidoEndpointParam).handle);
app.delete('/pedido/:pedidoId/combo/:comboId', new RemoverComboDoPedidoEndpoint(pedidoRepository).handle);

// Contexto de preparação
app.get('/preparacao/pedido/proximo', new BuscaProximoPedidoParaPreparacaoEndpoint(pedidoRepository).handle);
app.put('/preparacao/pedido/:pedidoId/iniciar-preparacao', new IniciarPreparacaoPedidoEndpoint(pedidoRepository).handle);
app.put('/preparacao/pedido/:pedidoId/finalizar-preparacao', new FinalizarPreparacaoPedidoEndpoint(pedidoRepository).handle);
app.put('/preparacao/pedido/:pedidoId/entregar', new EntregarPedidoEndpoint(pedidoRepository).handle);


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});