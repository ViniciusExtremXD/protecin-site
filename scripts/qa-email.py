"""Mostra, a partir do dump do banco, como o site envia e-mail e para quem vai o formulário de contato.

Uso: python -I scripts/qa-email.py <database.sql>
Não imprime chaves nem senhas.
"""
import json
import re
import sys

SEGREDO = re.compile(r"(pass|key|secret|token)", re.I)


def valor_sql(sql, inicio):
    """Lê a string SQL entre aspas simples que começa em `inicio` (logo após a aspa) e desfaz os escapes."""
    out, i = [], inicio
    while True:
        c = sql[i]
        if c == "\\":
            out.append({"n": "\n", "r": "\r", "t": "\t", "0": "\0"}.get(sql[i + 1], sql[i + 1]))
            i += 2
            continue
        if c == "'":
            return "".join(out)
        out.append(c)
        i += 1


def main(caminho):
    sql = open(caminho, encoding="utf-8", errors="replace").read()
    i = sql.find("'wp_mail_smtp','")
    if i >= 0:
        v = valor_sql(sql, i + len("'wp_mail_smtp','"))
        mailer = re.search(r's:6:"mailer";s:\d+:"([^"]*)"', v)
        print("WP Mail SMTP mailer:", mailer.group(1) if mailer else None)
        for k in ("from_email", "from_name", "from_email_force", "host", "port", "encryption", "auth", "domain"):
            for m in re.finditer(r's:\d+:"' + k + r'";(?:s:\d+:"([^"]*)"|(b:[01]|i:\d+))', v):
                print(f"  {k} = {m.group(1) if m.group(1) is not None else m.group(2)}")
        blocos = sorted(set(re.findall(r's:\d+:"([a-z0-9]+)";a:\d+:\{', v)))
        print("  blocos de configuração:", blocos)
    for nome in ("fluentmail-settings", "wpforms_settings"):
        j = sql.find(f"'{nome}','")
        print(f"opção {nome}:", "existe" if j >= 0 else "não existe")
    # Formulário de contato (WPForms 1847): o post_content é um JSON com as notificações.
    m = re.search(r"\(1847,\d+,'[^']*','[^']*','", sql)
    if m:
        conteudo = valor_sql(sql, m.end())
        try:
            form = json.loads(conteudo)
            notifs = form.get("settings", {}).get("notifications", {})
            print("WPForms 1847, título:", form.get("settings", {}).get("form_title"))
            for nid, n in notifs.items():
                print(f"  notificação {nid}: para={n.get('email')} | assunto={n.get('subject')} | remetente={n.get('sender_address')} | responder para={n.get('replyto')}")
            print("  confirmação:", {k: (str(v)[:120]) for k, v in form.get("settings", {}).get("confirmations", {}).get("1", {}).items() if k in ("type", "message", "redirect")})
        except json.JSONDecodeError as e:
            print("não consegui ler o JSON do formulário:", e)
    print("linhas no log de e-mails do FluentSMTP:", len(re.findall(r"INSERT INTO `SERVMASK_PREFIX_fsmpt_email_logs`", sql)))
    k = sql.find("INSERT INTO `SERVMASK_PREFIX_fsmpt_email_logs` VALUES (")
    if k >= 0:
        trecho = sql[k:k + 200000]
        datas = re.findall(r"'(20\d\d-\d\d-\d\d \d\d:\d\d:\d\d)'", trecho)
        status = re.findall(r"'(sent|failed|resent)'", trecho)
        print("  últimos envios registrados:", datas[-3:], "| status vistos:", sorted(set(status)), "| falhas:", status.count("failed"), "de", len(status))


if __name__ == "__main__":
    main(sys.argv[1])
