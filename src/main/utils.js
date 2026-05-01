export function staggeredFunctionCalling(funcOne, delay) {
  return new Promise((funcTwo) => {
    funcOne()

    setTimeout(() => {
      funcTwo()
    }, delay)
  })
}
