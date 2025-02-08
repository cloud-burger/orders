const pactum = require('pactum');
const { Given, When, Then, Before, After } = require('@cucumber/cucumber');

let spec = pactum.spec();
let stash = pactum.stash;

const url = 'http://localhost:8081/product';

Before(() => { 
    spec = pactum.spec();

    stash.clearDataTemplates();
    stash.loadData('./src/tests/data');
});

After({ tags: "@cleanup" }, async function () {
    await pactum.spec()
        .delete(url + '/{id}')
        .withPathParams('id', '$S{productId}');
});

async function createProduct() {
    let data = stash.getDataTemplate();
    let jsonData = data.OriginalProduct;
    if ("Product" in data) {
        jsonData = data.Product;
    }

    await spec
        .post(url)
        .withJson(jsonData)
        .stores('productId', 'id');    
}

async function updateProduct(id: string) {
    let data = stash.getDataTemplate();
    let jsonData = data.UpdatedProduct;
    if ("Product" in data) {
        jsonData = data.Product;
    }

    await spec
        .put(url + '/{id}')
        .withPathParams('id', id)
        .withJson(jsonData);
}

When('I try to create a new product', async function () {
    await createProduct();
});

Then('I should receive a success response', function () {
    spec.response().should.have.status(201);
});

Then('the same product data is returned', function () {
    spec.response().to.have.jsonLike({
        '@DATA:TEMPLATE@': 'OriginalProduct',
        '@OVERRIDES@': {
            'amount': 'R$ 19,99'
        }
    });
});

Given('that the product has already been created', async function () {
    await createProduct();
});

When('I try to create the same product', async function () {
    spec = pactum.spec();
    await spec
        .post(url)
        .withJson({
            '@DATA:TEMPLATE@': 'OriginalProduct'
        });
});

Then('I should receive a conflict response error', function () {
    spec.response().should.have.status(409);
});

Then('the message error received is {string}', function (message) {
    spec.response().to.have.jsonLike({
        'reason': message
    });
});

Given('that I have a data with the field {string} that not exists', function (field: string) {
    let data = stash.getDataTemplate();   
    data.Product = data.OriginalProduct;
    data.Product[field] = 1;

    stash.addDataTemplate(data);
});

Then('I should receive a bad request response error', function () {
    spec.response().should.have.status(400);
});

Then('the error of invalid param {string} is {string}', function (param: string, error: string) {
    spec.response().to.have.jsonLike({
        'invalidParams' : [
            {
                'name': param,
                'reason': error
            }
        ]
    });
});

Given('that the data product do not have the parameter {string}', function (param: string) {
    let data = stash.getDataTemplate();   
    data.Product = data.OriginalProduct;
    delete data.Product[param];

    stash.addDataTemplate(data);
});

When('I try to update the product', async function () {
    spec = pactum.spec()    
    await updateProduct(stash.getDataStore().productId);
});

Then('I should receive a OK response', function () {
    spec.response().should.have.status(200);
});

Then('the updated product data is returned', function () {
    spec.response().to.have.jsonLike({
        '@DATA:TEMPLATE@': 'UpdatedProduct',
        '@OVERRIDES@': {
            'amount': 'R$ 9,99'
        }
    });
});

When('I try to update the product with an id that not exists', async function () {
    await updateProduct('ce2d81f-0f17-42c1-8752-22481a533d0c');
});

Then('I should receive a not found response error', function () {
    spec.response().should.have.status(404);
});