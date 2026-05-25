import type { Metadata } from"next";
import DownloadsClient from"./DownloadsClient";

export const metadata: Metadata = {
 title:"下载记录 - 中文猎珍网",
};

export default function DownloadsPage() {
 return <DownloadsClient />;
}
