
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { adminClient } from "../../../../lib/adminSanity";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  if (!(await auth())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const stock = Number(body.stock ?? 0);
    const price = Number(body.price);

    if (
      !body.name ||
      !body.slug ||
      !body.category ||
      !body.image ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return NextResponse.json(
        { error: "Please provide valid product details and stock quantity." },
        { status: 400 }
      );
    }

    const product = await adminClient.create({
      _type: "product",
      name: body.name,
      slug: body.slug,
      category: body.category,
      price,
      description: body.description || "",
      image: body.image,
      images: body.images || [],
      stock,
      inStock: stock > 0 && body.inStock !== false,
      featured: Boolean(body.featured),
    });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/products");

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product creation error:", error);

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (!(await auth())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const products = await adminClient.fetch(`
      *[_type == "product"] | order(_createdAt desc) {
        _id,
        name,
        slug,
        category,
        price,
        description,
        image,
        images,
        stock,
        inStock,
        featured
      }
    `);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Product fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
