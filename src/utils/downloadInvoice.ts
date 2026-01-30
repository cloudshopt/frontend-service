export async function downloadInvoicePdf(orderId: number, token: string) {
    // const base = import.meta.env.VITE_INVOICE_URL as string;
    // const base = "http://localhost:7071/api/invoice";
    const base = "https://cloudshopt-invoice-b4eqaeaadkaqgwc5.italynorth-01.azurewebsites.net/api/invoice";
    if (!base) throw new Error("Missing VITE_INVOICE_URL");

    const url = `${base}?order_id=${encodeURIComponent(orderId)}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        let msg = `Invoice download failed (${res.status})`;
        try {
            const j = await res.json();
            msg = j?.message ?? msg;
        } catch {}
        throw new Error(msg);
    }

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `invoice-${orderId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(blobUrl);
}
