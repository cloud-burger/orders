const pactum = require('pactum');
const { Given, When, Then, Before, After } = require('@cucumber/cucumber');

let spec = pactum.spec();
let stash = pactum.stash;

const url = 'http://localhost:8081/product';

stash.addDataTemplate({
    'OriginalProduct': {
        "name": "X Burger test20",
        "category": "BURGER",
        "description": "Pão carne e queijo",
        "amount": 19.99,
        "image": "assets.myimage.com/213"
    }
});

Before(() => { spec = pactum.spec(); });

After({ tags: "@cleanup" }, async function () {
    await pactum.spec()
        .delete(url + '/{id}')
        .withPathParams('id', '$S{productId}');
});

async function postNewProduct() {
    await spec
        .post(url)
        .withJson({
            '@DATA:TEMPLATE@': 'Product'
        })
        .stores('productId', 'id');
}

When('I try to create a new product', async function () {
    let data = stash.getDataTemplate();
    data.Product = data.OriginalProduct;
    stash.addDataTemplate(data);

    await postNewProduct();
});

Then('I should receive a success response', function () {
    spec.response().should.have.status(201);
});

Then('the same product data is returned', function () {
    spec.response().to.have.jsonLike({
        '@DATA:TEMPLATE@': 'Product',
        '@OVERRIDES@': {
            'amount': 'R$ 19,99'
        }
    });
});

Given('that the product has already been created', async function () {
    let data = stash.getDataTemplate();
    data.Product = data.OriginalProduct;
    stash.addDataTemplate(data);

    await postNewProduct();
});

When('I try to create the same product', async function () {
    spec = pactum.spec();
    await spec
        .post(url)
        .withJson({
            '@DATA:TEMPLATE@': 'Product'
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