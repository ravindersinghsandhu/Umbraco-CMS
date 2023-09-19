﻿using System.Runtime.Serialization;
using Umbraco.Cms.Core.Models.Entities;
using Umbraco.Extensions;

namespace Umbraco.Cms.Core.Models;

public class Webhook : EntityBase
{
    private string _url;
    private WebhookEvent[] _events;
    private Guid[] _entityKeys;
    private bool _enabled;

    // Custom comparer for enumerable
    private static readonly DelegateEqualityComparer<IEnumerable<Guid>> _guidEnumerableComparer =
        new(
            (enum1, enum2) => enum1.UnsortedSequenceEqual(enum2),
            enum1 => enum1.GetHashCode());

    public Webhook(string url, bool? enabled = null, Guid[]? entityKeys = null, WebhookEvent[]? events = null)
    {
        _url = url;
        _events = events ?? Array.Empty<WebhookEvent>();
        _entityKeys = entityKeys ?? Array.Empty<Guid>();
        _enabled = enabled ?? false;
    }

    public string Url
    {
        get => _url;
        set => SetPropertyValueAndDetectChanges(value, ref _url!, nameof(Url));
    }

    public WebhookEvent[] Events
    {
        get => _events;
        set => SetPropertyValueAndDetectChanges(value, ref _events!, nameof(Events));
    }

    public Guid[] EntityKeys
    {
        get => _entityKeys;
        set => SetPropertyValueAndDetectChanges(value, ref _entityKeys!, nameof(EntityKeys), _guidEnumerableComparer);
    }

    public bool Enabled
    {
        get => _enabled;
        set => SetPropertyValueAndDetectChanges(value, ref _enabled, nameof(Enabled));
    }
}
