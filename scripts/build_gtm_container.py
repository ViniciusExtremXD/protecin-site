#!/usr/bin/env python3
"""Gera o JSON de importação do contêiner GTM do site atual da Protecin (WordPress).

Tag do Google (AW-17654682370) + vinculador de conversões + três conversões do Google Ads:
WhatsApp, ligação e formulário. Tudo só dispara em protecin.com.br, com ou sem www.

Uso: python scripts/build_gtm_container.py ACCOUNT_ID CONTAINER_ID GTM-XXXXXXX saida.json
"""
import json
import sys

ACCOUNT, CONTAINER, PUBLIC_ID, OUT = sys.argv[1:5]
ADS_ID = "AW-17654682370"
CONVERSION_ID = "17654682370"
HOST_REGEX = r"^(www\.)?protecin\.com\.br$"
ROTULO_WHATSAPP = "dnFdCJDujcAbEIKmtOJB"  # Lead Whatsapp
ROTULO_LIGACAO = "MunOCI-C4rIdEIKmtOJB"  # Lead - Ligação site
ROTULO_FORMULARIO = "o9O3COfSiNYcEIKmtOJB"  # FORMS - Protecin
CONFIRMACAO_WPFORMS = ".wpforms-confirmation-container-full"


def base(**kw):
    d = {"accountId": ACCOUNT, "containerId": CONTAINER}
    d.update(kw)
    return d


def tpl(key, value):
    return {"type": "TEMPLATE", "key": key, "value": value}


def boolean(key, value):
    return {"type": "BOOLEAN", "key": key, "value": "true" if value else "false"}


def host_filter():
    return {
        "type": "MATCH_REGEX",
        "parameter": [tpl("arg0", "{{Page Hostname}}"), tpl("arg1", HOST_REGEX)],
    }


def link_trigger(trigger_id, name, tipo_filtro, valor):
    return base(
        triggerId=trigger_id,
        name=name,
        type="LINK_CLICK",
        waitForTags=boolean("waitForTags", False),
        checkValidation=boolean("checkValidation", False),
        waitForTagsTimeout=tpl("waitForTagsTimeout", "2000"),
        uniqueTriggerId={"type": "TEMPLATE", "key": "uniqueTriggerId"},
        filter=[
            host_filter(),
            {
                "type": tipo_filtro,
                "parameter": [tpl("arg0", "{{Click URL}}"), tpl("arg1", valor)],
            },
        ],
    )


def conversion_tag(tag_id, name, label, trigger_id):
    return base(
        tagId=tag_id,
        name=name,
        type="awct",
        parameter=[
            boolean("enableNewCustomerReporting", False),
            boolean("enableConversionLinker", True),
            boolean("enableProductReporting", False),
            tpl("conversionId", CONVERSION_ID),
            tpl("conversionLabel", label),
            boolean("rdp", False),
        ],
        firingTriggerId=[trigger_id],
        tagFiringOption="ONCE_PER_EVENT",
        monitoringMetadata={"type": "MAP"},
        consentSettings={"consentStatus": "NOT_SET"},
    )


triggers = [
    base(triggerId="10", name="Inicialização – protecin.com.br", type="INIT", filter=[host_filter()]),
    link_trigger("12", "Clique – WhatsApp (link)", "CONTAINS", "wa.me"),
    link_trigger("13", "Clique – Telefone (link)", "STARTS_WITH", "tel:"),
    base(
        triggerId="14",
        name="Formulário enviado (confirmação do WPForms)",
        type="ELEMENT_VISIBILITY",
        filter=[host_filter()],
        parameter=[
            tpl("selectorType", "CSS"),
            tpl("elementSelector", CONFIRMACAO_WPFORMS),
            tpl("firingFrequency", "ONCE"),
            tpl("onScreenRatio", "1"),
            boolean("useOnScreenDuration", False),
            boolean("useDomChangeListener", True),
        ],
    ),
]

tags = [
    base(
        tagId="20",
        name="Tag do Google – Google Ads",
        type="googtag",
        parameter=[tpl("tagId", ADS_ID)],
        firingTriggerId=["10"],
        tagFiringOption="ONCE_PER_EVENT",
        monitoringMetadata={"type": "MAP"},
        consentSettings={"consentStatus": "NOT_SET"},
    ),
    base(
        tagId="21",
        name="Vinculador de conversões",
        type="gclidw",
        parameter=[
            boolean("enableCrossDomain", False),
            boolean("enableUrlPassthrough", False),
            boolean("enableCookieOverrides", False),
        ],
        firingTriggerId=["10"],
        tagFiringOption="ONCE_PER_EVENT",
        monitoringMetadata={"type": "MAP"},
        consentSettings={"consentStatus": "NOT_SET"},
    ),
    conversion_tag("22", "Ads – Lead Whatsapp", ROTULO_WHATSAPP, "12"),
    conversion_tag("23", "Ads – Lead - Ligação site", ROTULO_LIGACAO, "13"),
    conversion_tag("24", "Ads – FORMS - Protecin", ROTULO_FORMULARIO, "14"),
]

builtins = [
    base(type=t, name=n)
    for t, n in [
        ("PAGE_URL", "Page URL"),
        ("PAGE_HOSTNAME", "Page Hostname"),
        ("PAGE_PATH", "Page Path"),
        ("REFERRER", "Referrer"),
        ("EVENT", "Event"),
        ("CLICK_URL", "Click URL"),
        ("CLICK_TEXT", "Click Text"),
        ("CLICK_CLASSES", "Click Classes"),
    ]
]

export = {
    "exportFormatVersion": 2,
    "exportTime": "2026-11-05 12:00:00",
    "containerVersion": base(
        path="accounts/%s/containers/%s/versions/0" % (ACCOUNT, CONTAINER),
        containerVersionId="0",
        container=base(
            path="accounts/%s/containers/%s" % (ACCOUNT, CONTAINER),
            name="protecin.com.br",
            publicId=PUBLIC_ID,
            usageContext=["WEB"],
        ),
        tag=tags,
        trigger=triggers,
        builtInVariable=builtins,
    ),
}

with open(OUT, "w", encoding="utf-8") as fh:
    json.dump(export, fh, ensure_ascii=False, indent=2)
print(OUT, "tags=%d triggers=%d" % (len(tags), len(triggers)))
