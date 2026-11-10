"use server";

import { updateTag } from "next/cache";

export async function refreshProfile() {
  updateTag("my-profile");
}