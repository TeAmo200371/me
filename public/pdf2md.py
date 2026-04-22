import base64
from pathlib import Path
import requests
from tqdm import tqdm

API_URL = "https://ge9ec0ucgddfb6p4.aistudio-app.com/layout-parsing"
TOKEN ="你的百度paddle的api_key"

# 要扫描的根目录
INPUT_DIR = Path(r"文件位置")

# 支持的文件类型
PDF_EXTENSIONS = {".pdf"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

HEADERS = {
    "Authorization": f"token {TOKEN}",
    "Content-Type": "application/json"
}

# 关闭环境代理，避免 ProxyError
session = requests.Session()
session.trust_env = False


def get_file_type(file_path: Path):
    ext = file_path.suffix.lower()
    if ext in PDF_EXTENSIONS:
        return 0
    if ext in IMAGE_EXTENSIONS:
        return 1
    return None


def safe_name(path: Path):
    return path.stem.replace("/", "_").replace("\\", "_")


def should_skip(path: Path):
    # 跳过任何 OCR 输出目录
    return any(part.endswith("_ocr") for part in path.parts)


def download_image(img_url: str, save_path: Path):
    save_path.parent.mkdir(parents=True, exist_ok=True)
    try:
        resp = session.get(img_url, timeout=120)
        if resp.status_code == 200:
            with open(save_path, "wb") as f:
                f.write(resp.content)
            return True
        return False
    except Exception:
        return False


def parse_file(file_path: Path):
    if not file_path.exists():
        return False, f"文件不存在: {file_path}"

    file_type = get_file_type(file_path)
    if file_type is None:
        return False, f"不支持的文件类型: {file_path}"

    file_output_dir = file_path.parent / f"{safe_name(file_path)}_ocr"
    file_output_dir.mkdir(parents=True, exist_ok=True)

    final_md_path = file_output_dir / f"{file_path.stem}.md"

    # 已解析过则跳过
    if final_md_path.exists():
        return True, f"已存在，跳过: {final_md_path}"

    with open(file_path, "rb") as f:
        file_data = base64.b64encode(f.read()).decode("ascii")

    payload = {
        "file": file_data,
        "fileType": file_type,
        "useDocOrientationClassify": False,
        "useDocUnwarping": False,
        "useTextlineOrientation": False,
        "useChartRecognition": False,
    }

    response = session.post(
        API_URL,
        json=payload,
        headers=HEADERS,
        timeout=300
    )

    if response.status_code != 200:
        return False, f"解析失败: {file_path}\n状态码: {response.status_code}\n响应: {response.text[:1000]}"

    data = response.json()
    result = data.get("result")
    if not result:
        return False, f"返回结果中没有 result: {file_path}\n返回内容: {data}"

    merged_markdown_parts = []

    for i, res in enumerate(result.get("layoutParsingResults", []), start=1):
        markdown_info = res.get("markdown", {})
        markdown_text = markdown_info.get("text", "")

        for img_path, img_url in markdown_info.get("images", {}).items():
            local_img_path = file_output_dir / img_path
            ok = download_image(img_url, local_img_path)
            if not ok:
                print(f"\n下载 markdown 图片失败: {img_url}")

        merged_markdown_parts.append(f"\n\n<!-- page {i} -->\n\n{markdown_text}")

    final_markdown = "".join(merged_markdown_parts).strip()

    with open(final_md_path, "w", encoding="utf-8") as md_file:
        md_file.write(final_markdown)

    return True, f"Markdown 已保存: {final_md_path}"


def main():
    all_files = [
        p for p in INPUT_DIR.rglob("*")
        if p.is_file() and not should_skip(p)
    ]
    print(f"共找到文件 {len(all_files)} 个")

    supported_files = [p for p in all_files if get_file_type(p) is not None]
    print(f"其中支持解析的文件 {len(supported_files)} 个")

    success_count = 0
    fail_count = 0
    skip_count = 0
    failed_files = []

    with tqdm(supported_files, desc="OCR解析进度", unit="file") as pbar:
        for file_path in pbar:
            pbar.set_postfix_str(file_path.name)

            try:
                success, message = parse_file(file_path)

                if success:
                    if "已存在，跳过" in message:
                        skip_count += 1
                    else:
                        success_count += 1
                else:
                    fail_count += 1
                    failed_files.append((file_path, message))
                    print(f"\n{message}")

            except Exception as e:
                fail_count += 1
                failed_files.append((file_path, str(e)))
                print(f"\n文件处理失败，继续下一个: {file_path}")
                print(f"错误信息: {e}")

    print("\n全部处理完成")
    print(f"成功: {success_count}")
    print(f"跳过: {skip_count}")
    print(f"失败: {fail_count}")

    if failed_files:
        print("\n失败文件列表：")
        for file_path, error in failed_files:
            print(f"- {file_path}")
            print(f"  错误: {error}")


if __name__ == "__main__":
    main()
