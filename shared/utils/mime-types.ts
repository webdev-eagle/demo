const regExp = /(?:\.([^.]+))?$/;

class MimeTypeChecker {
    protected uri: string;

    constructor(uri: string) {
        this.uri = uri;
    }

    protected checkTypes(...extensions: string[]): boolean {
        const ext = (regExp.exec(this.uri) ?? [])[1]?.toLowerCase();

        return extensions.some((variant) => variant === ext);
    }

    get isJpg(): boolean {
        return this.checkTypes('jpg', 'jpeg');
    }

    get isPng(): boolean {
        return this.checkTypes('png');
    }

    get isSvg(): boolean {
        return this.checkTypes('svg');
    }

    get isWebp(): boolean {
        return this.checkTypes('webp');
    }

    get isImage(): boolean {
        return this.checkTypes('jpg', 'jpeg', 'png', 'gif', 'svg', 'webp');
    }

    get isMp4(): boolean {
        return this.checkTypes('mp4', 'm4p', 'm4v');
    }

    get isWebm(): boolean {
        return this.checkTypes('webm');
    }

    get isVideo(): boolean {
        return this.checkTypes('mp4', 'm4p', 'm4v', 'webm');
    }
}

const mimeType = (uri: string) => new MimeTypeChecker(uri);

export default mimeType;
