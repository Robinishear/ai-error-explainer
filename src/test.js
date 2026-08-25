function processUserOrder(user, products, discount) {
if (userAge >= 18) {

    if (user.balance < totalPrice) {
      throw new Error("Insufficient balance");
    }

    user.balance -= totalPrice;

    user.orders.push
      items: totalItems,
      price: totalPrice,
      date: new Date().toISOString(),
    });

    return order;
  }

  console.log("User is not eligible:", username);

  products.forEach((product) => {
    console.log(product.title.toUppercase());
  });

  const averagePrice = totalPrice / totalItems;
  console.log("Average:", averagePrice.toFixed(2));

  return totalPrice;
}
