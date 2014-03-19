module.exports = {
    'missing_client_approval': {
        priority: 'high',
        short_description: 'Site Disabled',
        tool_tip: 'Site Disabled',
        silk_icon_class: 'ui-silk-stop'
    },
    'missing_contract_approval': {
        priority: 'high',
        short_description: 'Need Contract Approval',
        tool_tip: "Need Scan Schedule.<br>Click icon to go to Schedule Page.",
        silk_icon_class: 'ui-silk-script'
    },
    'no_scan_sched': {
        priority: 'high',
        short_description: "Need Scan Schedule",
        tool_tip: "Need Scan Schedule.<br>Click icon to go to Schedule Page.",
        silk_icon_class: 'ui-silk-date'
    },
    "missing_cred": {
        priority: "high",
        short_description: "Need Credentials",
        tool_tip: "Please Provide Credentials.<br>Click icon to go to Credentials Page",
        silk_icon_class: "ui-silk-key-go"
    },
    "invalid_cred": {
        priority: "high",
        short_description: "Invalid Credentials",
        tool_tip: "Please Provide Valid Credentials. <br>Click icon to go to Credentials Page",
        silk_icon_class: "ui-silk-key-delete"
    },
    "be_upgrade_required": {
        priority: "medium",
        short_description: "BE Link Limit Exceeded",
        tool_tip: "BE Link Limit Exceeded",
        silk_icon_class: "ui-silk-link-error"
    },
    "suspended": {
        priority: "medium",
        short_description: "Configuration in Progress",
        tool_tip: "Configuration in Progress",
        silk_icon_class: "ui-silk-cog"
    },
    "unconfirmed_cred": {
        priority: "low",
        short_description: "Reviewing Credentials",
        tool_tip: "Reviewing Submitted Credentials",
        silk_icon_class: "reviewing_cred_icon"
    },
    "pl_verifying": {
        priority: "low",
        short_description: "Verification in Progress",
        tool_tip: "Vulnerability Verification in Progress",
        silk_icon_class: "ui-silk-zoom"
    },
    "running": {
        priority: "low",
        short_description: "Scan Running",
        tool_tip: "Scan Running",
        silk_icon_class: "ui-silk-control-play-blue"
    },
    "running_unauthenticated": {
        priority: "low",
        short_description: "Scanning w/o Credentials",
        tool_tip: "Scanning w/o Credentials",
        silk_icon_class: "scan_without_cred_icon"
    },
    "blackout": {
        priority: "low",
        short_description: "Paused Per Schedule",
        tool_tip: "Paused Per Schedule",
        silk_icon_class: "ui-silk-control-pause-blue"
    },
    "scheduled": {
        priority: "low",
        short_description: "Paused Per Schedule",
        tool_tip: "Paused Per Schedule",
        silk_icon_class: "ui-silk-control-pause-blue"
    },
    "pl_complete": {
        priority: "low",
        short_description: "Scan Complete",
        tool_tip: "Scan Complete",
        silk_icon_class: "ui-silk-accept"
    }
};