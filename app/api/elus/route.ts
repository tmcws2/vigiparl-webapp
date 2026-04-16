export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAnon } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const chambre = searchParams.get("chambre") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  const supabase = getSupabaseAnon();
  let query = supabase
    .from("elus")
    .select(`id,nom,prenom,chambre,groupe_sigle,groupe_label,famille_politique,departement,an_id,matricule,ep_id,mandat_clos,vigiparl_elu_scores(contributions_count,score_global,score_conditions_travail,score_relations_elu,score_contenu_travail,score_remuneration,score_ambiance,recommande_pct)`, { count: "exact" })
    .eq("mandat_clos", false)
    .range(offset, offset + limit - 1)
    .order("nom");

  if (q) query = query.or(`nom.ilike.%${q}%,prenom.ilike.%${q}%`);
  if (chambre) query = query.eq("chambre", chambre.toUpperCase());

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ elus: data, total: count, page, limit });
}
