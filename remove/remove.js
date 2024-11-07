const products = [
    {
        id: 1,
        name: "Laptop",
        price: 999.99,
        category: "Electronics",
        stock: 12,
        description: "A high-performance laptop with 16GB RAM and 512GB SSD",
        update_date: 1718495663959 // пример временной метки в миллисекундах
    },
    {
        id: 2,
        name: "Smartphone",
        price: 699.99,
        category: "Electronics",
        stock: 25,
        description: "Latest model smartphone with 128GB storage",
        update_date: 1718495663959
    },
    {
        id: 3,
        name: "Headphones",
        price: 149.99,
        category: "Accessories",
        stock: 50,
        description: "Wireless noise-cancelling headphones",
        update_date: 1718495663959
    },
    {
        id: 4,
        name: "Coffee Maker",
        price: 89.99,
        category: "Home Appliances",
        stock: 7,
        description: "Automatic coffee maker with 12-cup capacity",
        update_date: 1718495663959
    },
    {
        id: 5,
        name: "Office Chair",
        price: 129.99,
        category: "Furniture",
        stock: 15,
        description: "Ergonomic office chair with adjustable height",
        update_date: 1718495663959
    }
];

console.log(products);


const max_price = undefined; //550;
const min_price = 100 //undefined; // 100;


const min_stock = 5;
const max_stock = 100;

const filteredProductsByPrice = products.filter((elem) => {
    const isMinPrice = min_price ? min_price < elem.price : true;
    const isMaxPrice = max_price ? max_price > elem.price : true;
    const isMinStock = min_stock ? min_stock < elem.stock : true;
    const isMaxStock = max_stock ? max_stock > elem.stock : true;

    return isMaxPrice && isMinPrice && isMinStock && isMaxStock

    // if (min_price !== undefined && elem.price < max_price && elem.price > min_price) return true
    // if (min_price === undefined) return false
})
console.log(filteredProductsByPrice)




const i = document.querySelector('input')
const d = document.querySelector('div')
const createP = (arr) => {
    d.innerHTML = arr.map(elem => `<h1>${elem.name}</h1>`).join('')
}


const filters = () => {
    const searchRequest = i.value.toLowerCase();
    return products.filter((elem) => elem.name.toLowerCase().includes(searchRequest))
}

createP(products)
i.oninput = () => {
   
    const datas = filters()
    createP(datas)
}