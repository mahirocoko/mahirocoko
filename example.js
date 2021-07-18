import jsonData from 'data.json'

const orders: any = jsonData
  .filter(({ shop }) => shop === 1)
  .map(({ data }) =>
    data.map(({ id, name, price, order }: any) => ({
      id,
      name,
      price,
      amount: order.amount
    }))
  )

const data: any[] = []
for (const order of orders) {
  for (const food of order) {
    let find = data.find(({ id }) => food.id === id)
    if (find) {
      find.amount += food.amount
    } else {
      data.push(food)
    }
  }
}

console.log(data)
