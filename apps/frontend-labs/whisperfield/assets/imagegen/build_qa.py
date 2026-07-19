from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
SOURCES = ROOT / "assets/imagegen/sources"
QA = ROOT / "assets/imagegen/qa"
GENERATED = ROOT / "public/assets/generated"
FONT = ImageFont.load_default()


def contain(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    copy = image.copy()
    copy.thumbnail(size, Image.Resampling.LANCZOS)
    return copy


def cover(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    target_w, target_h = size
    scale = max(target_w / image.width, target_h / image.height)
    resized = image.resize(
        (round(image.width * scale), round(image.height * scale)),
        Image.Resampling.LANCZOS,
    )
    left = (resized.width - target_w) // 2
    top = (resized.height - target_h) // 2
    return resized.crop((left, top, left + target_w, top + target_h))


def checker(size: tuple[int, int], cell: int = 20) -> Image.Image:
    result = Image.new("RGB", size, "#f2f1ed")
    draw = ImageDraw.Draw(result)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            if (x // cell + y // cell) % 2:
                draw.rectangle((x, y, x + cell - 1, y + cell - 1), fill="#c9c7c2")
    return result


def label(draw: ImageDraw.ImageDraw, position: tuple[int, int], text: str, fill: str) -> None:
    draw.text(position, text, font=FONT, fill=fill)


def raw_source_contact_sheet() -> None:
    paths = [
        "whisperfield-mark-candidates.png",
        "hero-corner-clouds-source.png",
        "product-sky-source.png",
        "privacy-sky-source.png",
        "closing-sky-source.png",
        "customer-avatars-source.png",
    ]
    tile_w, tile_h = 600, 390
    sheet = Image.new("RGB", (tile_w * 2, tile_h * 3), "#e9e7e1")
    draw = ImageDraw.Draw(sheet)
    for index, name in enumerate(paths):
        image = Image.open(SOURCES / name).convert("RGB")
        preview = contain(image, (560, 330))
        col, row = index % 2, index // 2
        x = col * tile_w + (tile_w - preview.width) // 2
        y = row * tile_h + 36 + (330 - preview.height) // 2
        sheet.paste(preview, (x, y))
        label(draw, (col * tile_w + 20, row * tile_h + 14), name, "#17181b")
    sheet.save(QA / "raw-sources-contact-sheet.jpg", quality=90, optimize=True)


def cloud_alpha_contact_sheet() -> None:
    names = [
        "cloud-top-left.webp",
        "cloud-top-right.webp",
        "cloud-bottom-left.webp",
        "cloud-bottom-right.webp",
    ]
    backgrounds = ["white", "dark", "checker"]
    tile_w, tile_h = 360, 300
    sheet = Image.new("RGB", (tile_w * 3, tile_h * 4), "#dedbd4")
    draw = ImageDraw.Draw(sheet)
    for row, name in enumerate(names):
        asset = Image.open(GENERATED / name).convert("RGBA")
        asset = contain(asset, (320, 240))
        for col, background_name in enumerate(backgrounds):
            if background_name == "white":
                bg = Image.new("RGB", (320, 240), "#ffffff")
            elif background_name == "dark":
                bg = Image.new("RGB", (320, 240), "#171927")
            else:
                bg = checker((320, 240), 16)
            layer = Image.new("RGBA", (320, 240), (0, 0, 0, 0))
            layer.alpha_composite(asset, ((320 - asset.width) // 2, (240 - asset.height) // 2))
            bg.paste(layer.convert("RGB"), (0, 0), layer.getchannel("A"))
            x, y = col * tile_w + 20, row * tile_h + 42
            sheet.paste(bg, (x, y))
            label(draw, (x, row * tile_h + 18), f"{name} / {background_name}", "#17181b")
    sheet.save(QA / "cloud-alpha-contact-sheet.png", optimize=True)


def avatar_previews() -> None:
    raw = Image.open(SOURCES / "customer-avatars-source.png").convert("RGB")
    raw = contain(raw, (1152, 768))
    raw.save(QA / "avatar-source-sheet-preview.jpg", quality=92, optimize=True)

    names = [f"avatar-{index:02}.webp" for index in range(1, 7)]
    delivery = Image.new("RGB", (720, 500), "#e9e7e1")
    delivery_draw = ImageDraw.Draw(delivery)
    actual = Image.new("RGB", (540, 280), "#e9e7e1")
    actual_draw = ImageDraw.Draw(actual)
    for index, name in enumerate(names):
        image = Image.open(GENERATED / name).convert("RGB")
        col, row = index % 3, index // 3
        preview = image.resize((200, 200), Image.Resampling.LANCZOS)
        delivery.paste(preview, (20 + col * 240, 32 + row * 240))
        label(delivery_draw, (20 + col * 240, 12 + row * 240), name, "#17181b")

        actual_56 = image.resize((56, 56), Image.Resampling.LANCZOS)
        card_x, card_y = 10 + col * 180, 10 + row * 135
        actual.paste(actual_56, (card_x + 62, card_y + 30))
        label(actual_draw, (card_x + 54, card_y + 94), name, "#17181b")
    delivery.save(QA / "avatar-delivery-contact-sheet.jpg", quality=92, optimize=True)
    actual.save(QA / "avatar-56px-contact-sheet.png", optimize=True)


def plate_previews() -> None:
    names = ["product-sky.webp", "privacy-sky.webp", "closing-sky.webp"]
    plate_dir = QA / "plate-crops"
    plate_dir.mkdir(parents=True, exist_ok=True)
    sheet = Image.new("RGB", (1040, 1080), "#e9e7e1")
    draw = ImageDraw.Draw(sheet)
    for row, name in enumerate(names):
        image = Image.open(GENERATED / name).convert("RGB")
        desktop = cover(image, (640, 360))
        mobile_390 = cover(image, (390, 600))
        mobile_320 = cover(image, (320, 568))
        stem = Path(name).stem
        desktop.save(plate_dir / f"{stem}-desktop-16x9.jpg", quality=90, optimize=True)
        mobile_390.save(plate_dir / f"{stem}-mobile-390x600.jpg", quality=90, optimize=True)
        mobile_320.save(plate_dir / f"{stem}-mobile-320x568.jpg", quality=90, optimize=True)

        y = row * 360
        desktop_preview = desktop.resize((480, 270), Image.Resampling.LANCZOS)
        mobile_390_preview = mobile_390.resize((195, 300), Image.Resampling.LANCZOS)
        mobile_320_preview = mobile_320.resize((169, 300), Image.Resampling.LANCZOS)
        sheet.paste(desktop_preview, (20, y + 46))
        sheet.paste(mobile_390_preview, (540, y + 46))
        sheet.paste(mobile_320_preview, (775, y + 46))
        label(draw, (20, y + 18), f"{name} / desktop 16:9", "#17181b")
        label(draw, (540, y + 18), "center crop 390×600", "#17181b")
        label(draw, (775, y + 18), "center crop 320×568", "#17181b")
    sheet.save(QA / "plate-center-crops-contact-sheet.jpg", quality=91, optimize=True)


def final_delivery_contact_sheet() -> None:
    names = [
        "whisperfield-mark.svg",
        "product-sky.webp",
        "privacy-sky.webp",
        "closing-sky.webp",
        "cloud-top-left.webp",
        "cloud-top-right.webp",
        "cloud-bottom-left.webp",
        "cloud-bottom-right.webp",
        "avatar-01.webp",
        "avatar-02.webp",
        "avatar-03.webp",
        "avatar-04.webp",
        "avatar-05.webp",
        "avatar-06.webp",
    ]
    tile_w, tile_h = 320, 230
    sheet = Image.new("RGB", (tile_w * 3, tile_h * 5), "#e9e7e1")
    draw = ImageDraw.Draw(sheet)
    for index, name in enumerate(names):
        if name.endswith(".svg"):
            image = Image.open(QA / "whisperfield-mark-512.png").convert("RGBA")
        else:
            image = Image.open(GENERATED / name).convert("RGBA")
        preview = contain(image, (280, 180))
        col, row = index % 3, index // 3
        x, y = col * tile_w + 20, row * tile_h + 38
        bg = checker((280, 180), 14)
        layer = Image.new("RGBA", (280, 180), (0, 0, 0, 0))
        layer.alpha_composite(preview, ((280 - preview.width) // 2, (180 - preview.height) // 2))
        bg.paste(layer.convert("RGB"), (0, 0), layer.getchannel("A"))
        sheet.paste(bg, (x, y))
        label(draw, (x, row * tile_h + 16), name, "#17181b")
    sheet.save(QA / "final-delivery-contact-sheet.jpg", quality=91, optimize=True)


def main() -> None:
    QA.mkdir(parents=True, exist_ok=True)
    raw_source_contact_sheet()
    cloud_alpha_contact_sheet()
    avatar_previews()
    plate_previews()
    final_delivery_contact_sheet()


if __name__ == "__main__":
    main()
