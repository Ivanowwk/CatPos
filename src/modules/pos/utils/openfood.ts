export interface OpenFoodResult {
  code: string
  name: string
  brand?: string
  image?: string | null
  quantity?: string | null
  categories?: string[]
  nutriments?: Record<string, any>
}

export async function lookupOpenFoodFacts(barcode: string, timeoutMs = 6000): Promise<OpenFoodResult | null> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`, {
      signal: controller.signal
    })

    clearTimeout(id)

    if (!res.ok) return null

    const json = await res.json()

    if (json.status === 1 && json.product) {
      const p = json.product
      return {
        code: barcode,
        name: p.product_name || p.generic_name || `Producto ${barcode}`,
        brand: p.brands || undefined,
        image: p.image_small_url || p.image_url || null,
        quantity: p.quantity || p.packaging || null,
        categories: p.categories_tags || [],
        nutriments: p.nutriments || {}
      }
    }

    return null
  } catch (err) {
    clearTimeout(id)
    return null
  }
}

export async function fetchProductsByCountry(country: string, page = 1, pageSize = 100, timeoutMs = 10000): Promise<OpenFoodResult[]> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/country/${encodeURIComponent(country)}.json?page=${page}&page_size=${pageSize}`,
      { signal: controller.signal }
    )

    clearTimeout(id)

    if (!res.ok) return []

    const json = await res.json()

    if (!json.products || !Array.isArray(json.products)) return []

    return json.products.map((p: any) => ({
      code: p.code || p._id || '',
      name: p.product_name || p.generic_name || `Producto ${p.code || ''}`,
      brand: p.brands || undefined,
      image: p.image_small_url || p.image_url || null,
      quantity: p.quantity || p.packaging || null,
      categories: p.categories_tags || [],
      nutriments: p.nutriments || {}
    }))
  } catch (err) {
    clearTimeout(id)
    return []
  }
}
