"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/login', (req, res) => {
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: 'test-client',
        scope: 'openid',
        redirect_uri: 'http://localhost:5000/callback',
    });
    const url = `http://localhost:8080/realms/test-realm/protocol/openid-connect/auth?${params.toString()}`;
    console.log('Redirecting to:', url);
    res.redirect(url);
});
app.get('/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    const bodyParams = new URLSearchParams({
        client_id: 'test-client',
        grant_type: 'authorization_code',
        code: req.query.code,
        redirect_uri: 'http://localhost:5000/callback',
    });
    const url = `http://localhost:8080/realms/test-realm/protocol/openid-connect/token`;
    const response = yield (0, node_fetch_1.default)(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyParams.toString(),
    });
    const result = yield response.json();
    console.log('Token response:', result);
    res.json(result);
}));
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
